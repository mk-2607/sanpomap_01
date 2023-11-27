from django.urls import path
from . import views

app = 'sanpomap'
urlpatterns = [
    path('', views.Login, name='Login'),
    path("logout",views.Logout,name="Logout"),
    path('register',views.AccountRegistration.as_view(), name='register'),
    ##path("home",views.home,name="home"),
    path('sanpomap/', views.home, name='sanpomap'),
    path('history/', views.history, name='history'),
]