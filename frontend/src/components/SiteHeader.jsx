import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../api/authApi";
import {
  clearTokens,
  getRefreshToken,
  getRole,
  isLoggedIn,
} from "../auth/tokenStorage";

// staff/admin 전용 관리 메뉴 목록입니다.
// enabled가 false인 항목은 아직 만들 페이지가 없어서 비활성화 버튼으로만 둡니다.
const ADMIN_MENU_ITEMS = [
  { label: "PROJECT", to: "/write", enabled: true },
  { label: "NEWS", enabled: false },
  { label: "ABOUT", enabled: false },
  { label: "CONTACT", enabled: false },
  { label: "MEMBER", enabled: false },
];

// role에 따라 오른쪽 상단 버튼 색이 달라집니다.
// (guest: 검정+빨강 hover / staff: 보라+검정 hover / admin: 빨강+검정 hover)
const ROLE_BADGE_CLASS = {
  guest: "nav-role-badge--guest",
  staff: "nav-role-badge--staff",
  admin: "nav-role-badge--admin",
};

/**
 * 모든 화면 상단에 공통으로 나오는 헤더입니다.
 * 회사명("dahn.architects")을 클릭하면 Home(=게시글 목록)으로 이동합니다.
 *
 * Project/News/About/Contact는 지금 있는 페이지만 검정색, 나머지는
 * 회색으로 표시됩니다(밑줄 없음).
 *
 * LOGIN/GUEST/STAFF/ADMIN 버튼은 이 메뉴와 별개로, MENU 버튼과 같은
 * 모양(둥근 사각형)이고 로그인 상태에 따라 바뀝니다.
 * - 로그아웃 상태: 검은색 "LOGIN" -> 클릭하면 로그인 화면으로 이동
 * - 로그인 상태: 사용자의 role("GUEST"/"STAFF"/"ADMIN")을 표시
 *   -> 클릭하면 MENU 버튼처럼 "내 정보"/"로그아웃" 메뉴가 아래로 펼쳐짐
 *   -> "로그아웃"을 누르면 "로그아웃 하시겠습니까?" 확인창이 뜨고, 예/아니오로 선택
 *
 * role이 staff/admin이면 회사명 오른쪽에 MENU 버튼이 추가로 보이고,
 * 누르면 PROJECT/NEWS/ABOUT/CONTACT/회원 관리 메뉴가 아래로 펼쳐집니다.
 */
export default function SiteHeader() {
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const loggedIn = isLoggedIn();
  const role = getRole();
  const canManage = loggedIn && (role === "staff" || role === "admin");

  const handleLogout = async () => {
    setIsLogoutConfirmOpen(false);
    // 1. 서버에 저장된 refresh_token도 지워서, 유출되더라도 재사용 못 하게 합니다.
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await signOut(refreshToken).catch(() => {});
    }
    // 2. 브라우저에 저장해둔 토큰을 지우고 목록으로 이동합니다.
    clearTokens();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-brand-group">
          <Link to="/" className="site-brand">
            <span className="site-name">dahn.architects</span>
          </Link>

          {canManage && (
            <div className="admin-menu-wrapper">
              <button
                type="button"
                className="admin-menu-button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  setIsMenuOpen((prev) => !prev);
                }}
              >
                MENU
              </button>

              {isMenuOpen && (
                <>
                  {/* 메뉴 바깥을 누르면 닫히도록 하는 투명한 배경입니다. */}
                  <div
                    className="admin-menu-backdrop"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="admin-menu-dropdown">
                    <div className="admin-menu-label">
                      {role.toUpperCase()} MENU
                    </div>
                    {ADMIN_MENU_ITEMS.map((item) =>
                      item.enabled ? (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="admin-menu-item"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={item.label}
                          type="button"
                          className="admin-menu-item"
                          disabled
                        >
                          {item.label}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <nav className="projects-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item nav-item--active" : "nav-item"
            }
          >
            Project
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "nav-item nav-item--active" : "nav-item"
            }
          >
            News
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-item nav-item--active" : "nav-item"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-item nav-item--active" : "nav-item"
            }
          >
            Contact
          </NavLink>
          {loggedIn ? (
            <div className="account-menu-wrapper">
              <button
                type="button"
                className={`admin-menu-button ${ROLE_BADGE_CLASS[role] ?? ""}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAccountMenuOpen((prev) => !prev);
                }}
              >
                {role.toUpperCase()}
              </button>

              {isAccountMenuOpen && (
                <>
                  {/* 메뉴 바깥을 누르면 닫히도록 하는 투명한 배경입니다. */}
                  <div
                    className="admin-menu-backdrop"
                    onClick={() => setIsAccountMenuOpen(false)}
                  />
                  <div className="admin-menu-dropdown">
                    <div className="admin-menu-label">USER MENU</div>
                    <button type="button" className="admin-menu-item" disabled>
                      MY INFO
                    </button>
                    <button
                      type="button"
                      className="admin-menu-item"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsLogoutConfirmOpen(true);
                      }}
                    >
                      LOG OUT
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="admin-menu-button">
              LOGIN
            </NavLink>
          )}
        </nav>
      </div>

      {isLogoutConfirmOpen && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>로그아웃 하시겠습니까?</p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="confirm-yes"
                onClick={handleLogout}
              >
                예
              </button>
              <button
                type="button"
                className="confirm-no"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
