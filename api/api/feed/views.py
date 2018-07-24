from django.db.models import Q
from friendship.models import Follow
from rest_framework import generics, status, views
from rest_framework.response import Response

from api.accounts.models import TwitterishUser
from api.feed.models import Post
from api.feed.serializers import PostSerializer
from api.utils import get_user_from_auth_header, has_access_to_feed


class MainFeedList(generics.ListAPIView):
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        user = get_user_from_auth_header(request)
        if user:
            following = Follow.objects.following(user)
            self.queryset = Post.objects.filter(
                Q(user__in=following) | Q(user=user)).order_by(
                '-created_at')
            return super(MainFeedList, self).list(request, args, kwargs)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)


class UserFeedList(generics.ListAPIView):
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        feed_user = TwitterishUser.objects.get(username=kwargs['username'])
        if has_access_to_feed(request, feed_user):
            self.queryset = Post.objects.filter(
                user=feed_user).order_by(
                '-created_at')
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)

        self.queryset = Post.objects.filter(user=feed_user).order_by(
            '-created_at')
        return super(UserFeedList, self).list(request, args, kwargs)


class PostDetail(views.APIView):
    def get(self, request, *args, **kwargs):
        post = Post.objects.get(pk=kwargs['post_id'])
        feed_user = TwitterishUser.objects.get(pk=post.user.pk)
        if has_access_to_feed(request, feed_user):
            return Response(PostSerializer(post).data)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)


class CreatePost(views.APIView):
    def post(self, request, format=None):
        user = get_user_from_auth_header(request)
        if user:
            post = Post()
            post.user = user
            post.content = request.data['content']
            post.save()
            return Response(PostSerializer(post).data)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)
