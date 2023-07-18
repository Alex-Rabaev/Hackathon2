from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import viewsets
from .models import MyListGame
from accounts.serializers import MyListGameSerializer

# Create your views here.
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response


class HomePageView(LoginRequiredMixin, TemplateView):
    template_name = "homepage.html"


class MyListGameViewSet(viewsets.ModelViewSet):
    queryset = MyListGame.objects.all()
    serializer_class = MyListGameSerializer


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
