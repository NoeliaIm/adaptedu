import React, { useState } from 'react';
import TeacherForm from './components/TeacherForm';
import StudentSearch from './components/StudentSearch.tsx';
import StudentForm from './components/StudentForm';
import { Student, TeacherForm as TeacherFormType  , Subject} from './types';
import { mockStudents } from './mockData';
import { AVAILABLE_SUBJECTS } from './types/subjects';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import FileUploadStep from './components/FileUploadStep';
import ReviewStep from './components/ReviewStep';
import ConfirmationStep from './components/ConfirmationStep';

function App() {
    const [formData, setFormData] = useState<TeacherFormType>({
        firstName: '',
        lastName: '',
        subjects: [{ ...AVAILABLE_SUBJECTS[0] }],
    });

    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        lastName: '',
        subject: '',
    });
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubjectChange = (id: string, newSubject: Subject) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject) =>
                subject.id === id ? newSubject : subject
            ),
        }));
    };

    const addSubject = () => {
        const availableSubjects = AVAILABLE_SUBJECTS.filter(
            (subject) => !formData.subjects.some((s) => s.id === subject.id)
        );
        if (availableSubjects.length > 0) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, { ...availableSubjects[0] }],
            }));
        }
    };

    const removeSubject = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((subject) => subject.id !== id),
        }));
    };

    const isFormValid = () => {
        return (
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            formData.subjects.every((subject) => subject.name.trim() !== '')
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            setSubmitted(true);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const filteredStudents = students.filter((student) => {
        const nameMatch = student.firstName
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const lastNameMatch = student.lastName
            .toLowerCase()
            .includes(filters.lastName.toLowerCase());
        const subjectMatch = student.subjects.some((subject) =>
            subject.toLowerCase().includes(filters.subject.toLowerCase())
        );

        return (
            (filters.name === '' || nameMatch) &&
            (filters.lastName === '' || lastNameMatch) &&
            (filters.subject === '' || subjectMatch)
        );
    });

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setShowStudentForm(true);
    };

    const handleEditStudent = (student: Student) => {
        setSelectedStudent(student);
        setShowStudentForm(true);
    };

    const handleStudentSubmit = (studentData: Omit<Student, 'id'>) => {
        if (selectedStudent) {
            setStudents((prev) =>
                prev.map((student) =>
                    student.id === selectedStudent.id
                        ? { ...studentData, id: student.id }
                        : student
                )
            );
        } else {
            const newStudent: Student = {
                ...studentData,
                id: crypto.randomUUID(),
            };
            setStudents((prev) => [...prev, newStudent]);
        }
        setShowStudentForm(false);
        setSelectedStudent(null);
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const simulateUpload = () => {
        setUploadStatus('uploading');
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploadStatus('success');
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    const handleNext = () => {
        if (currentStep === 3) {
            simulateUpload();
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {showStudentForm ? (
                    <StudentForm
                        onSubmit={handleStudentSubmit}
                        onCancel={() => {
                            setShowStudentForm(false);
                            setSelectedStudent(null);
                        }}
                        availableSubjects={formData.subjects.map((s) => s.name)}
                        initialData={selectedStudent || undefined}
                    />
                ) : (
                    <>
                        <TeacherForm
                            formData={formData}
                            onInputChange={handleInputChange}
                            onSubjectChange={handleSubjectChange}
                            onAddSubject={addSubject}
                            onRemoveSubject={removeSubject}
                            onSubmit={handleSubmit}
                            isFormValid={isFormValid}
                            submitted={submitted}
                        />

                        <StudentSearch
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            filteredStudents={filteredStudents}
                            onAddStudent={handleAddStudent}
                            onEditStudent={handleEditStudent}
                        />

                        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                            <div className="max-w-2xl mx-auto">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                        Subida de Archivos
                                    </h1>
                                    <p className="text-gray-600">
                                        Sigue los pasos para subir tu archivo de forma segura
                                    </p>
                                </div>

                                {/* Progress Steps */}
                                <div className="flex justify-between mb-8 relative">
                                    <div
                                        className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"/>
                                    <div
                                        className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500 -translate-y-1/2 z-0"
                                        style={{width: `${((currentStep - 1) / 2) * 100}%`}}/>

                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="relative z-10 flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                                }`}
                                            >
                                                {step}
                                            </div>
                                            <span className={`mt-2 text-sm ${
                                                step <= currentStep ? 'text-blue-500' : 'text-gray-500'
                                            }`}>
                {step === 1 ? 'Selección' : step === 2 ? 'Revisión' : 'Confirmación'}
              </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Content */}
                                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                                    {currentStep === 1 && (
                                        <FileUploadStep
                                            onFileSelect={handleFileSelect}
                                            selectedFile={selectedFile}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <ReviewStep
                                            selectedFile={selectedFile}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <ConfirmationStep
                                            uploadProgress={uploadProgress}
                                            uploadStatus={uploadStatus}
                                        />
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between">
                                    {currentStep > 1 && uploadStatus !== 'success' && (
                                        <button
                                            onClick={handleBack}
                                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2"/>
                                            Atrás
                                        </button>
                                    )}
                                    {uploadStatus === 'success' ? (
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2"/>
                                            Subir otro archivo
                                        </button>
                                    ) : (
                                        currentStep < 4 && (
                                            <button
                                                onClick={handleNext}
                                                disabled={!selectedFile || (currentStep === 3 && uploadStatus === 'uploading')}
                                                className={`flex items-center px-6 py-3 ml-auto rounded-lg
                  ${
                                                    !selectedFile
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                            >
                                                {currentStep === 3 ? 'Subir archivo' : 'Siguiente'}
                                                <ArrowRight className="w-4 h-4 ml-2"/>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;