import { Link, NavLink } from "react-router-dom";

/**
 * 모든 화면 상단에 공통으로 나오는 헤더입니다.
 * 회사명("dahn.architects")을 클릭하면 Home(=게시글 목록)으로 이동합니다.
 */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand">
          <span className="site-name">dahn.architects</span>
        </Link>
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
          {/* News/About/Contact는 아직 만들 페이지가 없어서
              누르면 이동하는 링크 없이 자리만 잡아둡니다. */}
          <span className="nav-item">News</span>
          <span className="nav-item">About</span>
          <span className="nav-item">Contact</span>
          <NavLink
            to="/write"
            className={({ isActive }) =>
              isActive ? "nav-item nav-item--active" : "nav-item"
            }
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
