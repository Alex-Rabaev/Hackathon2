from django.urls import path
from .views import SignupView, LoginView, LogoutView, ProfileView, MyListView, UserView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/<int:username_id>/", ProfileView.as_view(), name="profile"),
    path("mylist/", MyListView.as_view(), name="mylist"),
]
