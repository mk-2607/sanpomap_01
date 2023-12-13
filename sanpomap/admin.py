from django.contrib import admin
from .models import TotalDistance

# Register your models here.
from .models import Account
admin.site.register(Account)
admin.site.register(TotalDistance)