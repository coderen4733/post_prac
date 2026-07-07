from datetime import datetime, timezone

from pydantic import BaseModel, Field

from apps.user.models.enums import SignInType, UserRole


class UserEntity(BaseModel):
    # 1. 기본 정보
    email: str  # 이메일
    name: str  # 이름
    password: str  # 비밀번호

    # 2. 시스템 및 권한
    role: UserRole = Field(
        default=UserRole.GUEST, description="권한[guest, staff, admin]"
    )
    sign_in_type: SignInType = Field(
        default=SignInType.EMAIL,
        description="가입경로[email, naver, kakao, google]",
    )

    # 3. 시간 메타데이터
    # 3-1. 생성일
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    # 3-2. 수정일
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
