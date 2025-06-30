import React, { useState } from 'react';
import { Plus, FolderOpen, FileText, Edit3, Trash2, Calendar, Tag, MoreVertical } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Website',
      description: 'Building a modern e-commerce platform',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      category: 'Web Development',
      createdDate: '2024-06-15',
      notes: [
        { id: 1, title: 'Design Requirements', content: 'User interface mockups and wireframes needed', date: '2024-06-16' },
        { id: 2, title: 'Database Schema', content: 'Design product catalog and user management tables', date: '2024-06-17' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'React Native app for task management',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      category: 'Mobile Development',
      createdDate: '2024-06-10',
      notes: [
        { id: 3, title: 'API Integration', content: 'Connect with backend services for data sync', date: '2024-06-12' }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: '',
    color: 'bg-gradient-to-br from-blue-500 to-purple-500'
  });
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const colorOptions = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-pink-500 to-rose-500'
  ];

  const addProject = () => {
    if (newProject.name.trim()) {
      const project = {
        ...newProject,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        notes: []
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '', category: '', color: colorOptions[0] });
      setShowAddProject(false);
    }
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const addNote = () => {
    if (newNote.title.trim() && selectedProject) {
      const note = {
        ...newNote,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, notes: [...p.notes, note] }
          : p
      );
      
      setProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, notes: [...selectedProject.notes, note] });
      setNewNote({ title: '', content: '' });
      setShowAddNote(false);
    }
  };

  const deleteNote = (noteId) => {
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, notes: p.notes.filter(n => n.id !== noteId) }
        : p
    );
    
    setProjects(updatedProjects);
    setSelectedProject({ 
      ...selectedProject, 
      notes: selectedProject.notes.filter(n => n.id !== noteId) 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Projects</h1>
            <p className="text-gray-600">Manage your projects and organize your thoughts</p>
          </div>
          <button
            onClick={() => setShowAddProject(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={`h-32 ${project.color} relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{project.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{project.notes.length} notes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Created {project.createdDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-1">
            {selectedProject ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{selectedProject.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProject.description}</p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedProject.notes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{note.title}</h4>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{note.content}</p>
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                  ))}
                  
                  {selectedProject.notes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No notes yet</p>
                      <p className="text-sm">Click the + button to add your first note</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Project</h3>
                <p className="text-gray-500">Choose a project to view and manage its notes</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Project Modal */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create New Project</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Project description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Web Development, Marketing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setNewProject({...newProject, color})}
                        className={`w-8 h-8 rounded-lg ${color} ${newProject.color === color ? 'ring-2 ring-gray-400' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addProject}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Note Modal */}
        {showAddNote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add Note</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Note title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Write your note here..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}