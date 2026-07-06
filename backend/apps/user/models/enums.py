from enum import Enum


class UserRole(str, Enum):
    GUEST = "guest"
    STAFF = "staff"
    ADMIN = "admin"


class SignInType(str, Enum):
    EMAIL = "email"
    NAVER = "naver"
    KAKAO = "kakao"
    GOOGLE = "google"
