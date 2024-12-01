from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser, Group, Permission


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    languages = models.CharField(max_length=255, default="Unknown")
    image = models.URLField(max_length=500, blank=True, null=True)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    # Add related_name to avoid clashing with the default `auth.User` model
    groups = models.ManyToManyField(
        Group,
        # This prevents clashing with the default `auth.User.groups`
        related_name='customuser_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        # This prevents clashing with the default `auth.User.user_permissions`
        related_name='customuser_permissions',
        blank=True,
    )

    def __str__(self):
        return self.username
