from django.db import models


class Post(models.Model):
    user = models.ForeignKey('accounts.TwitterishUser',
                             on_delete=models.CASCADE,)
    content = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
