import Peer from 'skyway-js';

document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('skyway');
  if (container) {
    const apiKey = container.dataset.skyway;

    let localStream = null;
    let existingCall = null;

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(function (stream) {
        // Success
        document.getElementById('my-video').srcObject = stream;
        localStream = stream;
      }).catch(function (error) {
      // Error
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });

//
    const peer = new Peer({key: apiKey, debug: 3});

// SkyWayのシグナリングサーバと接続し、利用する準備が整ったら
    peer.on('open', () => {
      document.getElementById('my-id').innerText = peer.id;
    });

// 何らかのエラーが発生した場合
    peer.on('error', (err) => {
      alert(err.message);
    });

// Peer（相手）との接続が切れた
    peer.on('close', () => {
    });

// シグナリングサーバとの接続が切れた
    peer.on('disconnected', () => {
    });

    document.getElementById('make-call').addEventListener('submit', (e) => {
      e.preventDefault();
      const call = peer.call(document.getElementById('callto-id').value, localStream);
      setupCallEventHandlers(call);
    });

    document.getElementById('end-call').addEventListener('submit', (e) => {
      e.preventDefault();
      existingCall.close();
    });

    peer.on('call', (call) => {
      call.answer(localStream);
      setupCallEventHandlers(call);
    });

// 今回は既に接続中の場合は一旦既存の接続を切断し、後からきた接続要求を優先します。
// また、切断処理等で利用するため、CallオブジェクトをexistingCallとして保持しておきます。
// この処理はアプリの仕様次第です。
    function setupCallEventHandlers(call) {
      if (existingCall) {
        existingCall.close();
      }

      existingCall = call;

      // 相手のカメラ映像・マイク音声を受信した際に発火します。
// 取得したStreamオブジェクトをvideo要素にセットします。
      call.on('stream', (stream) => {
        addVideo(call, stream);
        setupEndCallUI();
        document.getElementById('their-id').innerText = call.remoteId;
      });

// call.close()による切断処理が実行され、実際に切断されたら発火
      call.on('close', () => {
        removeVideo(call.remoteId);
        setupMakeCallUI();
      });
    }

    function addVideo(call, stream) {
      document.getElementById('their-video').srcObject = stream;
      document.getElementById('their-video').setAttribute('id', call.remoteId);
    }

    function removeVideo(peerId) {
      const element = document.getElementById(peerId);
      const container = element.parentElement;
      const newElement = document.createElement('video');
      newElement.setAttribute('id', 'their-video');
      container.insertBefore(newElement, element);
      container.removeChild(element);
    }

    function setupMakeCallUI() {
      document.getElementById('make-call').style.display = 'block';
      document.getElementById('end-call').style.display = 'none';
    }

    function setupEndCallUI() {
      document.getElementById('make-call').style.display = 'none';
      document.getElementById('end-call').style.display = 'block';
    }
  }
}, false);
