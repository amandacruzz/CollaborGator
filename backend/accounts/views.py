# accounts/views.py

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt  # Skip CSRF for simplicity in this example
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)  # Parse JSON data from React
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if username and email and password:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        return JsonResponse({'error': 'Invalid data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        # Parse JSON data from the request body
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
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid login credentials'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
