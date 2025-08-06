import Navbar from '../components/Navbar'; // Sẽ tạo sau
import Footer from '../components/Footer'; // Sẽ tạo sau

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;