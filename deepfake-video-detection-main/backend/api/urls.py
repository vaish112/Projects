from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views
from .views import RegisterView

urlpatterns = [
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('detection/', views.detection_api, name="main-detection"),
    # path('detection/v2/', views.detection_apiv2, name="main-detection-v2"),
    path('', views.getRoutes)
]
