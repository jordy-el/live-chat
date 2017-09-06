Rails.application.routes.draw do
  root 'static_pages#home'


  scope '/api' do
    resources :messages, only: [:create]
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
