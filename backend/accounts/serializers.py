from rest_framework import serializers
from .models import Project
from django.contrib.auth.models import User


class ProjectSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description',
                  'languages', 'image', 'creator', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
