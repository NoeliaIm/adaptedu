import React, {useEffect, useState} from 'react';
import TeacherForm from '../components/TeacherForm';
import StudentSearch from '../components/StudentSearch';
import StudentForm from '../components/StudentForm';
import SubjectList from '../components/SubjectList';
import {Student, Subject, TeacherForm as TeacherFormType} from '../types';
import {useSubjects} from "../hooks/useSubjects.ts";
import {useStudents} from "../hooks/useStudents.ts";
import {useTeachers} from "../hooks/useTeachers.ts";
import { useAuth } from '../hooks/useAuth';


function Home() {
    const { subjects, loadingSubjects, errorSubjects } = useSubjects();
    const { userData ,  verifyStoredToken } = useAuth();
    const [isVerifying, setIsVerifying] = useState(true);
    const [formData, setFormData] = useState<TeacherFormType>({
        firstName: '',
        lastName: '',
        email: '',
        subjects:  subjects.length > 0 ? [{ ...subjects[0] }] : [],
    });

    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        lastName: '',
        subject: '',
    });

    const [showStudentForm, setShowStudentForm] = useState(false);
    const { students, loadingStudents, errorStudents, createOrUpdateStudent, deleteStudent } = useStudents();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const { createTeacher } = useTeachers();

    useEffect(() => {
        const verify = async () => {
            setIsVerifying(true);
            await verifyStoredToken();
            setIsVerifying(false);
        };
        verify();
    }, [verifyStoredToken]);


    if (isVerifying || loadingSubjects || loadingStudents) {
        return <p>Cargando datos...</p>;
    }

    if (!userData) {
        return null;
    }

    if (errorSubjects || errorStudents) {
        return <p>Error al cargar datos. Por favor, inténtalo de nuevo.</p>;
    }


    const resetFormData = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            subjects: [],
        });
        setSubmitted(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubjectChange = (id: number | undefined, newSubject: Subject) => {
        if (id === undefined) return; // Add a guard against undefined
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject) =>
                subject.idAsignatura === id ? newSubject : subject
            ),
        }));
    };

    const addSubject = () => {
        const availableSubjects = subjects.filter(
            (subject) => !formData.subjects.some((s) => s.idAsignatura === subject.idAsignatura)
        );
        if (availableSubjects.length > 0) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, {...availableSubjects[0]}],
            }));
        }
    };

    const removeSubject = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((subject) => subject.idAsignatura !== id),
        }));
    };

    const isFormValid = () => {
        return (
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            formData.subjects.every((subject) => subject.nombreAsignatura.trim() !== '')
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            createTeacher(formData).then(() =>  setSubmitted(true));
        }
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
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
        const subjectMatch = filters.subject === '' || student.subjects.some(
            (subject) => subject.idAsignatura === parseInt(filters.subject)
        );

        return (
            (filters.name === '' || nameMatch) &&
            (filters.lastName === '' || lastNameMatch) &&
            subjectMatch
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

    const handleStudentSubmit = (studentData:  Omit<Student, 'id'>) => {
        if (studentData) {
            createOrUpdateStudent(studentData).then(() => {
                setShowStudentForm(false);
                setSelectedStudent(null);
            })
                .catch((error) => {
                    console.error('Error al guardar el estudiante:', error);
                });
        }
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
                        availableSubjects={formData.subjects}
                        initialData={selectedStudent || undefined}
                    />
                ) : (
                    <>
                        <TeacherForm
                            formData={formData}
                            onResetForm={resetFormData}
                            onInputChange={handleInputChange}
                            onSubjectChange={handleSubjectChange}
                            onAddSubject={addSubject}
                            onRemoveSubject={removeSubject}
                            onSubmit={handleSubmit}
                            isFormValid={isFormValid}
                            submitted={submitted}
                        />

                        <SubjectList
                           // onAddSubject={addSubject}
                        />

                        <StudentSearch
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            filteredStudents={filteredStudents}
                            onAddStudent={handleAddStudent}
                            onEditStudent={handleEditStudent}
                            deleteStudent={deleteStudent}
                        />

                    </>
                )}
            </div>
        </div>
    );
}

export default Home;