from django.contrib.auth.models import User  # Use the default User model
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import Project
from .serializers import ProjectSerializer
import json
from .serializers import UserSerializer
from rest_framework.views import APIView


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        username = data.get('username')  # Get username
        password = data.get('password')

        if email and username and password:  # Ensure username is included
            # Create the user with the given fields
            user = User.objects.create_user(  # Using default User model now
                username=username,  # Save username
                email=email,
                password=password
            )
            user.save()
            return JsonResponse({'message': 'User registered successfully'}, status=201)

        return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required.'}, status=400)

        try:
            # Use default User model for querying
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
            creator=request.user  # This will automatically reference the authenticated user
        )
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=201)


class UserProfileView(APIView):
    # Ensure only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the current authenticated user
        # Use a serializer to format the user data
        serializer = UserSerializer(user)
        return Response(serializer.data)
