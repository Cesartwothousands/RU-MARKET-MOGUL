from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Add the cash field to the User model
User.add_to_class('cash', models.DecimalField(
    max_digits=32, decimal_places=4, null=True, default=1000.00))


class PurchasedStock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=10)
    share = models.DecimalField(max_digits=32, decimal_places=1)

    def __str__(self):
        return f'{self.user.username} - {self.stock_symbol}'
