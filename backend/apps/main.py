from contextlib import asynccontextmanager  # Lifespan 생성에 사용할 contextlib

from fastapi import FastAPI  # FastAPI로 Back-End 구성
from fastapi.middleware.cors import (
    CORSMiddleware,  # CORS 설정을 위한 Middleware
)
from motor.motor_asyncio import (
    AsyncIOMotorClient,  # MongoDB 연결에 사용할 motor
)

from apps.api import api_router  # Router 등록
from core.config import MONGODB_DB, MONGODB_URL  # .env 환경변수 로드


# APP Lifespan ❤️
# L-1. lifespan 정의: 앱 시작과 종료 시 실행될 로직
@asynccontextmanager
async def lifespan(app: FastAPI):
    # A. [Startup] 앱이 켜질 때 실행
    app.mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    app.mongodb = app.mongodb_client.get_database(MONGODB_DB)
    try:
        # A-1. MongoDB 연결 성공
        await app.mongodb_client.admin.command("ping")
        print("MongoDB 연결에 성공했습니다.")
    # A-2. MongoDB 연결 실패
    except Exception as err:
        print(f"MongoDB 연결에 실패했습니다. {err}")
    # A-3. App 실행
    yield
    # B. [Shutdown] 앱이 꺼질 때 실행
    app.mongodb_client.close()
    print("MongoDB 연결이 종료되었습니다.")


# L-2. FastAPI 인스턴스 생성 시 lifespan(L-1)을 따름
app = FastAPI(lifespan=lifespan)


# CORS 설정 🖥️
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 테스트용이므로 모두 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check API ✅
@app.get("/health-check", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
    }


# APP Router 등록 🚥
app.include_router(api_router)
