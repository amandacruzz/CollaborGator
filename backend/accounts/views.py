from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import Project
from .serializers import ProjectSerializer
import json

@csrf_exempt  
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)  
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if username and email and password:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            # Generate token for the new user
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({
                'message': 'User registered successfully',
                'token': token.key  
            }, status=201)
        return JsonResponse({'error': 'Invalid data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        # Find the user with the provided email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid login credentials'}, status=400)
        
        # Authenticate using the username from the retrieved user
        user = authenticate(request, username=user.username, password=password)
        
        if user is not None:
            login(request, user)
            # Generate token if not already created
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({
                'message': 'Login successful',
                'token': token.key  
            }, status=200)
        else:   
            return JsonResponse({'error': 'Invalid login credentials'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        # Assign the authenticated user as the creator
        project = Project.objects.create(
            name=data.get('name'),
            description=data.get('description'),
            languages=data.get('languages', 'Unknown'),
            creator=request.user
        )
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=201)
