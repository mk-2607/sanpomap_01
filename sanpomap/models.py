from django.db import models
# Create your models here.
from django.contrib.auth.models import User

# ユーザーアカウントのモデルクラス
class Account(models.Model):
    objects = models.Manager()
    # ユーザー認証のインスタンス(1vs1関係)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # 追加フィールド
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    account_image = models.ImageField(upload_to="profile_pics",blank=True)

    def __str__(self):
        return str(self.user)
        
class TotalDistance(models.Model):
    total_distance = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Total Distance: {self.total_distance} km'
        
class WalkHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_distance = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Total Distance: {self.total_distance} km'