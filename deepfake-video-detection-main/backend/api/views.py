from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from api.detectionCode import handle_uploaded_file, detectFakeVideo
# from api.detectionCodev2 import handle_uploaded_file, main_detection

from .models import Detection


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/login',
        '/api/register',
        '/api/refresh-token',
        '/api/detection',
        '/api/detectionv2'
    ]
    return Response(routes)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def detection_api(request):
    if request.method == 'GET':
        data = {'b': 60, 'username': request.user.id}
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        up_file = request.FILES.get('file')
        handle_uploaded_file(up_file)
        prediction, face_cropped = detectFakeVideo(f"uploads/{up_file}")
        if prediction[0] == 0:
            output = "FAKE"
        else:
            output = "REAL"
        confidence = prediction[1]
        data = {'output': output, 'confidence': confidence}
        try:
            entry = Detection(author=request.user, file_name=up_file, result=data['output'],
                              confidence=data['confidence'])
            entry.save()
        except ValueError as e:
            return Response({'response': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# def detection_apiv2(request):
    if request.method == 'GET':
        data = {'b': 60, 'username': request.user.id}
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        up_file = request.FILES.get('file')
        handle_uploaded_file(up_file)
        main_detection()
    return Response({}, status.HTTP_400_BAD_REQUEST)
