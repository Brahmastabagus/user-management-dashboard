import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Panel,
  DOMHelper,
  Navbar
} from 'rsuite';
import { Link, Outlet, useLocation, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { Dashboard, Icon, UserBadge } from '@rsuite/icons';
const { getWidth } = DOMHelper


const Brand = () => {
  return (
    <div className="w-full px-2 py-2 bg-primary text-white">
      <h3>Brand</h3>
    </div>
  );
};

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expand ? <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg> : <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const Index = () => {
  const headerRef = useRef()
  const [expand, setExpand] = useState(true);
  const location = useLocation()
  const { id } = useParams()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 1100) {
      setExpand(false);
    } else {
      setExpand(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (getWidth(headerRef.current) < 1100) {
      setExpand(false)
    } else {
      setExpand(true)
    }
  }, [])
  return (
    <div className="w-full min-h-screen">
      <Container className="min-h-screen">
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={expand ? 200 : 56}
          collapsible
        >
          <Sidenav.Header>
            <Brand />
          </Sidenav.Header>
          <Sidenav appearance="subtle" expanded={expand}>
            <Sidenav.Body>
              <Nav defaultActiveKey="1">
                <Nav.Item as={Link} to='/' eventKey="1" active={location.pathname === '/'} icon={
                  <Icon as={Dashboard} className="!size-5" />
                }>
                  Dashboard
                </Nav.Item>
                <Nav.Item as={Link} to='/add-user' eventKey="2" active={location.pathname === '/add-user'} icon={<Icon as={UserBadge} className="!size-5" />}>
                  Add User
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container ref={headerRef} className="min-h-screen">
          <Header className="page-header bg-primary text-white px-2 py-3">
            <h4>{(location.pathname === "/" && "Dashboard") || (location.pathname === "/add-user" && "Add User") || (id && "Edit User")}</h4>
          </Header>
          <Content className="bg-gray-100 p-2">
            <Panel className="bg-white rounded">
              <Outlet />
            </Panel>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Index;