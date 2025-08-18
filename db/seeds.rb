# Task Management System Seeds
# This file creates sample data for testing the application

# Create Users
puts "Creating users..."
users = [
  { name: "John Doe", job_title: "Frontend Developer" },
  { name: "Jane Smith", job_title: "Backend Developer" },
  { name: "Mike Johnson", job_title: "Product Manager" },
  { name: "Sarah Wilson", job_title: "Designer" },
  { name: "David Brown", job_title: "QA Engineer" }
]

users.each do |user_data|
  User.find_or_create_by!(name: user_data[:name]) do |user|
    user.job_title = user_data[:job_title]
  end
end

puts "Created #{User.count} users"

# Create Lists
puts "Creating lists..."
lists_data = [
  "Frontend Development",
  "Backend Development", 
  "Design Tasks",
  "Testing & QA",
  "Project Management"
]

lists_data.each do |list_name|
  List.find_or_create_by!(name: list_name)
end

puts "Created #{List.count} lists"

# Create Tasks
puts "Creating tasks..."
frontend_list = List.find_by(name: "Frontend Development")
backend_list = List.find_by(name: "Backend Development")
design_list = List.find_by(name: "Design Tasks")
testing_list = List.find_by(name: "Testing & QA")
pm_list = List.find_by(name: "Project Management")

john = User.find_by(name: "John Doe")
jane = User.find_by(name: "Jane Smith")
mike = User.find_by(name: "Mike Johnson")
sarah = User.find_by(name: "Sarah Wilson")
david = User.find_by(name: "David Brown")

tasks_data = [
  # Frontend tasks
  { name: "Implement user dashboard", list: frontend_list, assignee: john, limit_date: 3.days.from_now, completed: false },
  { name: "Add responsive navigation", list: frontend_list, assignee: john, limit_date: 1.week.from_now, completed: true },
  { name: "Create task editing form", list: frontend_list, assignee: john, estimated_time: 5.days.from_now, completed: false },
  
  # Backend tasks
  { name: "Setup authentication API", list: backend_list, assignee: jane, limit_date: 2.days.from_now, completed: true },
  { name: "Implement task CRUD operations", list: backend_list, assignee: jane, estimated_time: 1.week.from_now, completed: false },
  { name: "Add database migrations", list: backend_list, assignee: jane, completed: true },
  
  # Design tasks
  { name: "Design user interface mockups", list: design_list, assignee: sarah, limit_date: 4.days.from_now, completed: false },
  { name: "Create app icon and branding", list: design_list, assignee: sarah, estimated_time: 1.week.from_now, completed: false },
  
  # Testing tasks
  { name: "Write unit tests for models", list: testing_list, assignee: david, limit_date: 3.days.from_now, completed: false },
  { name: "Setup CI/CD pipeline", list: testing_list, assignee: david, estimated_time: 5.days.from_now, completed: false },
  
  # PM tasks
  { name: "Define project requirements", list: pm_list, assignee: mike, completed: true },
  { name: "Schedule team standup meetings", list: pm_list, assignee: mike, limit_date: 1.day.from_now, completed: false },
  { name: "Review project timeline", list: pm_list, assignee: mike, estimated_time: 2.days.from_now, completed: false }
]

tasks_data.each do |task_data|
  Task.find_or_create_by!(name: task_data[:name], list: task_data[:list]) do |task|
    task.assignee = task_data[:assignee]
    task.limit_date = task_data[:limit_date]
    task.estimated_time = task_data[:estimated_time]
    task.completed = task_data[:completed]
    task.notify_to = task_data[:notify_to] || []
  end
end

puts "Created #{Task.count} tasks"
puts "✅ Seed data created successfully!"
puts ""
puts "Summary:"
puts "- #{User.count} users"
puts "- #{List.count} lists"
puts "- #{Task.count} tasks"
puts "- #{Task.completed.count} completed tasks"
puts "- #{Task.pending.count} pending tasks"
