# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "sortablejs", to: "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/modular/sortable.esm.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/services", under: "services"
pin_all_from "app/javascript/components", under: "components"
