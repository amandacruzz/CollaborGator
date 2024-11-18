from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    languages = models.CharField(max_length=255, default="Unknown")
    image = models.URLField(max_length=500, blank=True, null=True)  
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
