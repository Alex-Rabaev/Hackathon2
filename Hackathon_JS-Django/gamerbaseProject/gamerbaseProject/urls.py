"""
URL configuration for gamerbaseProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from games.views import MyListGameViewSet
from accounts.views import UserView


router = routers.DefaultRouter()
router.register(r"mylistgames", MyListGameViewSet)
router.register(r"custom-url", MyListGameViewSet)
router.register(r"mylistgames", UserView)
router.register(r"custom-url", UserView)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("", include("games.urls")),
    path("accounts/", include("accounts.urls")),
    path(
        "api/mylistgames/", MyListGameViewSet.as_view({"get": "list", "post": "create"})
    ),
    path(
        "api/mylistgames/<int:pk>/",
        MyListGameViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
    ),
    path("api/users/", UserView.as_view({"get": "list", "post": "create"})),
    path(
        "api/users/<int:pk>/",
        UserView.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),
    ),
]
