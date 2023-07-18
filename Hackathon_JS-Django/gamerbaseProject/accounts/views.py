from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse_lazy
from django.views.generic import CreateView, FormView
from .forms import SignUpForm, LoginForm
from django.contrib.auth.models import User
from django.views.generic import View
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.models import UserProfile
from games.models import MyListGame
from django.views.generic import TemplateView
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import UserSerializer, MyListGameSerializer


class SignupView(CreateView):
    form_class = SignUpForm
    model = User
    template_name = "signup.html"
    success_url = reverse_lazy("login")


class LoginView(FormView):
    form_class = LoginForm
    template_name = "login.html"

    def form_valid(self, form):
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(self.request, user)
            return redirect("homepage")
        return super().form_invalid(form)


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect("login")


class ProfileView(View):
    def get(self, request, username_id):
        user = get_object_or_404(User, id=username_id)
        context = {"user": user}
        return render(request, "profile.html", context)


class MyListView(LoginRequiredMixin, TemplateView):
    template_name = "myList.html"


class UserView(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer


# class UserView(APIView):
#     def get(self, request, *args, **kwargs):
#         if "pk" in kwargs:
#             post = UserProfile.objects.get(id=kwargs["pk"])
#             serializer = UserSerializer(post)
#             return Response(serializer.data)
#         else:
#             queryset = UserProfile.objects.all()
#             serializer = UserSerializer(queryset, many=True)
#             return Response(serializer.data)
#             # return Response(status=status.HTTP_404_NOT_FOUND)

#     def post(self, request, *args, **kwargs):
#         serializer = UserSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data)
#         return Response(serializer.errors)

#     def delete(self, request, pk, *args, **kwargs):
#         post = UserProfile.objects.get(id=pk)
#         post.delete()
#         return Response()

#     def put(self, request, pk, *args, **kwargs):
#         post = UserProfile.objects.get(id=pk)
#         serializer = UserSerializer(post, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors)


# class UserGamesView(APIView):
#     def get(self, request, *args, **kwargs):
#         if "pk" in kwargs:
#             post = MyListGame.objects.get(id=kwargs["pk"])
#             serializer = MyListGameSerializer(post)
#             return Response(serializer.data)
#         else:
#             queryset = MyListGame.objects.all()
#             serializer = MyListGameSerializer(queryset, many=True)
#             return Response(serializer.data)
#             # return Response(status=status.HTTP_404_NOT_FOUND)

#     def post(self, request, *args, **kwargs):
#         serializer = MyListGameSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(data=serializer.data)
#         return Response(serializer.errors)

#     def delete(self, request, pk, *args, **kwargs):
#         post = MyListGame.objects.get(id=pk)
#         post.delete()
#         return Response()

#     def put(self, request, pk, *args, **kwargs):
#         post = MyListGame.objects.get(id=pk)
#         serializer = MyListGameSerializer(post, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors)
