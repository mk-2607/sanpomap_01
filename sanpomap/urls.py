from django.urls import path
from . import views

app = 'sanpomap'

urlpatterns = [
    path('save_total_distance/<int:total_distance>/', views.save_total_distance, name='save_total_distance'),
    path('', views.Login, name='Login'),
    path("logout",views.Logout,name="Logout"),
    path('register',views.AccountRegistration.as_view(), name='register'),
    ##path("home",views.home,name="home"),
    path('sanpomap/', views.home, name='sanpomap'),
    path('history/', views.history, name='history'),
    path('save_total_distance/<total_distance>/', views.save_total_distance, name='save_total_distance'),
]