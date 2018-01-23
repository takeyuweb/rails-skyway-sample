class CreateMeetings < ActiveRecord::Migration[5.1]
  def change
    create_table :meetings, comment: '会議' do |t|
      t.string :name, null: false, default: '', comment: '会議の名前'

      t.timestamps
    end
  end
end
