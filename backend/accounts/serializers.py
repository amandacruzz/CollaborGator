from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField()  

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'languages', 'image', 'creator', 'created_at']
