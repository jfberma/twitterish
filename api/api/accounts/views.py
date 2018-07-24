from friendship.models import Follow
from rest_framework import generics, status, views
from rest_framework.response import Response

from api.accounts.models import TwitterishUser
from api.accounts.serializers import UserSerializer
from api.utils import get_user_from_auth_header


class UserList(generics.ListAPIView):
    queryset = TwitterishUser.objects.all()
    serializer_class = UserSerializer


class FollowingList(generics.ListAPIView):
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user = get_user_from_auth_header(request)
        if user:
            self.queryset = Follow.objects.following(user)
            return super(FollowingList, self).list(request, args, kwargs)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)


class FollowUser(generics.ListAPIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        user = get_user_from_auth_header(request)
        if user:
            user_to_follow = TwitterishUser.objects.get(pk=request.data['user'])
            Follow.objects.add_follower(user, user_to_follow)
            self.queryset = Follow.objects.following(user)
            return super(FollowUser, self).list(request, None, None)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)


class UnFollowUser(generics.ListAPIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        user = get_user_from_auth_header(request)
        if user:
            user_to_unfollow = TwitterishUser.objects.get(pk=request.data['user'])
            Follow.objects.remove_follower(user, user_to_unfollow)
            self.queryset = Follow.objects.following(user)
            return super(UnFollowUser, self).list(request, None, None)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)


class FeedPrivacySetting(views.APIView):
    def put(self, request, *args, **kwargs):
        user = get_user_from_auth_header(request)
        if user:
            private = request.data['private']
            user.private = private
            user.save()
            return Response(UserSerializer(user).data, status.HTTP_200_OK)
        else:
            return Response({}, status.HTTP_403_FORBIDDEN)
