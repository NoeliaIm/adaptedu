import React, {useState} from 'react';
import TeacherForm from '../components/TeacherForm';
import StudentSearch from '../components/StudentSearch';
import StudentForm from '../components/StudentForm';
import {Student, Subject, TeacherForm as TeacherFormType} from '../types';
import {mockStudents} from '../mockData';
import {AVAILABLE_SUBJECTS} from '../types/subjects';

function Home() {
    const [formData, setFormData] = useState<TeacherFormType>({
        firstName: '',
        lastName: '',
        subjects: [{...AVAILABLE_SUBJECTS[0]}],
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
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
                subjects: [...prev.subjects, {...availableSubjects[0]}],
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
                        ? {...studentData, id: student.id}
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

                    </>
                )}
            </div>
        </div>
    );
}

export default Home;