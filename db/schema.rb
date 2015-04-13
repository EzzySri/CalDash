# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150413210311) do

  create_table "event_assignments", force: :cascade do |t|
    t.string   "name",                        null: false
    t.string   "location"
    t.string   "category"
    t.decimal  "start_unix",                  null: false
    t.decimal  "end_unix",                    null: false
    t.decimal  "lat"
    t.decimal  "lng"
    t.string   "description"
    t.boolean  "is_private",  default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_assignments", ["end_unix"], name: "index_event_assignments_on_end_unix"
  add_index "event_assignments", ["start_unix"], name: "index_event_assignments_on_start_unix"

  create_table "events", force: :cascade do |t|
    t.string   "name",                                    null: false
    t.string   "mandatory",                               null: false
    t.string   "location"
    t.string   "category"
    t.decimal  "start_unix",                              null: false
    t.decimal  "end_unix",                                null: false
    t.decimal  "after_unix",                              null: false
    t.decimal  "before_unix",                             null: false
    t.decimal  "lat"
    t.decimal  "lng"
    t.string   "description"
    t.boolean  "is_private",              default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "duration_in_miliseconds"
  end

  add_index "events", ["after_unix"], name: "index_events_on_after_unix"
  add_index "events", ["before_unix"], name: "index_events_on_before_unix"
  add_index "events", ["end_unix"], name: "index_events_on_end_unix"
  add_index "events", ["start_unix"], name: "index_events_on_start_unix"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name"
    t.string   "last_name"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
