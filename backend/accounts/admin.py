from django.contrib import admin
from .models import Project
from .models import CustomUser


admin.site.register(Project)
admin.site.register(CustomUser)
