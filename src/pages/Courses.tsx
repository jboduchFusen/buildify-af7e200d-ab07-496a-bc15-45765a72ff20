
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGolfData, Course } from '../context/GolfDataContext';
import { PlusCircle, MoreHorizontal, Search, Flag, Edit, Trash2, GolfClub } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/courses.css';

const Courses = () => {
  const { courses, addCourse, deleteCourse, loading } = useGolfData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    holes: 18,
    par: 72,
    slope: 113,
    rating: 72.0,
    tees: 'White',
    location: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.name.trim()) {
      addCourse({
        name: newCourse.name.trim(),
        holes: Number(newCourse.holes),
        par: Number(newCourse.par),
        slope: Number(newCourse.slope),
        rating: Number(newCourse.rating),
        tees: newCourse.tees.trim(),
        location: newCourse.location.trim() || undefined,
      });
      setNewCourse({
        name: '',
        holes: 18,
        par: 72,
        slope: 113,
        rating: 72.0,
        tees: 'White',
        location: '',
      });
      setIsAddDialogOpen(false);
    }
  };

  const toggleDropdown = (courseId: string) => {
    setActiveDropdown(activeDropdown === courseId ? null : courseId);
  };

  const handleDeleteCourse = (id: string) => {
    const { getCourseRounds } = useGolfData();
    const courseRounds = getCourseRounds(id);
    
    let confirmMessage = 'Are you sure you want to delete this course?';
    if (courseRounds.length > 0) {
      confirmMessage += ` This will also delete ${courseRounds.length} associated rounds.`;
    }
    
    if (window.confirm(confirmMessage)) {
      deleteCourse(id);
      setActiveDropdown(null);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.location && course.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">Courses</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="btn-icon-left" />
          Add Course
        </button>
      </div>

      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {courses.length === 0 ? (
        <div className="empty-courses">
          <div className="empty-icon-container">
            <Flag className="empty-icon" />
          </div>
          <h2 className="empty-title">No courses yet</h2>
          <p className="empty-description">
            You haven't added any golf courses yet. Add your first course to start tracking rounds.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="btn-icon-left" />
            Add Course
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-results">
          <p>No courses found matching your search.</p>
        </div>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Par</th>
              <th>Rating/Slope</th>
              <th>Tees</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => {
              const { getCourseRounds } = useGolfData();
              const courseRounds = getCourseRounds(course.id);
              
              return (
                <tr key={course.id}>
                  <td>
                    <Link to={`/courses/${course.id}`} className="course-name-link">
                      {course.name}
                    </Link>
                  </td>
                  <td>{course.par}</td>
                  <td>{course.rating} / {course.slope}</td>
                  <td>{course.tees}</td>
                  <td>{course.location || '-'}</td>
                  <td className="course-actions">
                    <div className="dropdown">
                      <button 
                        className="dropdown-button"
                        onClick={() => toggleDropdown(course.id)}
                      >
                        <MoreHorizontal />
                      </button>
                      {activeDropdown === course.id && (
                        <div className="dropdown-menu">
                          <div className="dropdown-label">Actions</div>
                          <div className="dropdown-separator"></div>
                          <Link 
                            to={`/courses/${course.id}`} 
                            className="dropdown-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View details
                          </Link>
                          <Link 
                            to={`/rounds/add`} 
                            state={{ courseId: course.id }}
                            className="dropdown-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <GolfClub className="dropdown-icon" />
                            Add round
                          </Link>
                          <div className="dropdown-separator"></div>
                          <button 
                            className="dropdown-item destructive"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="dropdown-icon" />
                            Delete course
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Add Course Dialog */}
      {isAddDialogOpen && (
        <div className="add-course-dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2 className="dialog-title">Add New Course</h2>
              <p className="dialog-description">Enter the details for the new golf course.</p>
            </div>
            <form className="dialog-form" onSubmit={handleAddCourse}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Course Name</label>
                <input
                  id="name"
                  className="form-input"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="Augusta National"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="holes" className="form-label">Holes</label>
                  <input
                    id="holes"
                    type="number"
                    className="form-input"
                    value={newCourse.holes}
                    onChange={(e) => setNewCourse({ ...newCourse, holes: parseInt(e.target.value) })}
                    min="9"
                    max="18"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="par" className="form-label">Par</label>
                  <input
                    id="par"
                    type="number"
                    className="form-input"
                    value={newCourse.par}
                    onChange={(e) => setNewCourse({ ...newCourse, par: parseInt(e.target.value) })}
                    min="60"
                    max="80"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="slope" className="form-label">Slope Rating</label>
                  <input
                    id="slope"
                    type="number"
                    className="form-input"
                    value={newCourse.slope}
                    onChange={(e) => setNewCourse({ ...newCourse, slope: parseInt(e.target.value) })}
                    min="55"
                    max="155"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating" className="form-label">Course Rating</label>
                  <input
                    id="rating"
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={newCourse.rating}
                    onChange={(e) => setNewCourse({ ...newCourse, rating: parseFloat(e.target.value) })}
                    min="60"
                    max="80"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="tees" className="form-label">Tees</label>
                <input
                  id="tees"
                  className="form-input"
                  value={newCourse.tees}
                  onChange={(e) => setNewCourse({ ...newCourse, tees: e.target.value })}
                  placeholder="White, Blue, Red, etc."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location" className="form-label">Location (optional)</label>
                <input
                  id="location"
                  className="form-input"
                  value={newCourse.location}
                  onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                  placeholder="Augusta, GA"
                />
              </div>
              <div className="dialog-footer">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;