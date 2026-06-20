import { useState, useEffect, useCallback } from "react";
import { userService, classService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Table, Button, Modal, Input, Select, Badge, Avatar,
  SearchInput, PageHeader,
} from "../../components/common";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Teacher" },
  { value: "3", label: "Student" },
  { value: "4", label: "Parent" },
];

const TEACHER_ALLOWED_ROLES = ["3", "4"];

const ROLE_BADGE_VARIANT = {
  Admin: "primary",
  Teacher: "success",
  Student: "info",
  Parent: "warning",
};

// ─── Empty form factories ─────────────────────────────────────────────────────

function emptyGenericForm() {
  return {
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    roleId: "",
    phone: "",
  };
}

function emptyStudentForm() {
  return {
    studentFirstName: "",
    studentLastName: "",
    studentUserName: "",
    studentEmail: "",
    studentPassword: "",
    studentPhone: "",
    classId: "",
    teacherId: "",
    parentFirstName: "",
    parentLastName: "",
    parentUserName: "",
    parentEmail: "",
    parentPassword: "",
    parentPhone: "",
  };
}

function emptyParentForm() {
  return {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    passwordHash: "",
    phone: "",
    studentId: "",
  };
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateEmail(v) {
  return /\S+@\S+\.\S+/.test(v);
}

function validatePhone(v) {
  return /^\d{10}$/.test(v);
}

function validateGenericForm(form) {
  const e = {};

  if (!form.firstName.trim()) e.firstName = "First name is required";
  if (!form.lastName.trim()) e.lastName = "Last name is required";
  if (!form.userName.trim()) e.userName = "Username is required";

  if (!form.email.trim()) e.email = "Email is required";
  else if (!validateEmail(form.email)) e.email = "Valid email required";

  if (!form.passwordHash) e.passwordHash = "Password is required";
  else if (form.passwordHash.length < 6) e.passwordHash = "Minimum 6 characters";

  if (!form.roleId) e.roleId = "Role is required";

  if (!form.phone.trim()) e.phone = "Phone number is required";
  else if (!validatePhone(form.phone)) e.phone = "Must be exactly 10 digits";

  return e;
}

function validateStudentForm(form, isAdmin) {
  const e = {};

  if (!form.studentFirstName.trim()) e.studentFirstName = "First name is required";
  if (!form.studentLastName.trim()) e.studentLastName = "Last name is required";
  if (!form.studentUserName.trim()) e.studentUserName = "Username is required";

  if (!form.studentEmail.trim()) e.studentEmail = "Email is required";
  else if (!validateEmail(form.studentEmail)) e.studentEmail = "Valid email required";

  if (!form.studentPassword) e.studentPassword = "Password is required";
  else if (form.studentPassword.length < 6) e.studentPassword = "Minimum 6 characters";

  if (!form.studentPhone.trim()) e.studentPhone = "Phone is required";
  else if (!validatePhone(form.studentPhone)) e.studentPhone = "Must be exactly 10 digits";

  if (!form.classId) e.classId = "Class is required";
  if (isAdmin && !form.teacherId) e.teacherId = "Teacher is required";

  if (!form.parentFirstName.trim()) e.parentFirstName = "First name is required";
  if (!form.parentLastName.trim()) e.parentLastName = "Last name is required";
  if (!form.parentUserName.trim()) e.parentUserName = "Username is required";

  if (!form.parentEmail.trim()) e.parentEmail = "Email is required";
  else if (!validateEmail(form.parentEmail)) e.parentEmail = "Valid email required";

  if (!form.parentPassword) e.parentPassword = "Password is required";
  else if (form.parentPassword.length < 6) e.parentPassword = "Minimum 6 characters";

  if (!form.parentPhone.trim()) e.parentPhone = "Phone is required";
  else if (!validatePhone(form.parentPhone)) e.parentPhone = "Must be exactly 10 digits";

  return e;
}

function validateParentForm(form) {
  const e = {};

  if (!form.firstName.trim()) e.firstName = "First name is required";
  if (!form.lastName.trim()) e.lastName = "Last name is required";
  if (!form.userName.trim()) e.userName = "Username is required";

  if (!form.email.trim()) e.email = "Email is required";
  else if (!validateEmail(form.email)) e.email = "Valid email required";

  if (!form.passwordHash) e.passwordHash = "Password is required";
  else if (form.passwordHash.length < 6) e.passwordHash = "Minimum 6 characters";

  if (!form.phone.trim()) e.phone = "Phone is required";
  else if (!validatePhone(form.phone)) e.phone = "Must be exactly 10 digits";

  if (!form.studentId) e.studentId = "Student is required";

  return e;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      margin: "1.25rem 0 0.75rem",
    }}>
      <span style={{
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-text-muted)",
        whiteSpace: "nowrap",
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UsersPage() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "Admin";
  const isTeacher = currentUser?.role === "Teacher";
  const canCreate = isAdmin || isTeacher;

  // ── Data state ──
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // for Parent modal student picker
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ── Generic modal (Admin / Teacher) ──
  const [genericOpen, setGenericOpen] = useState(false);
  const [genericForm, setGenericForm] = useState(emptyGenericForm());
  const [genericErrs, setGenericErrs] = useState({});
  const [genericSaving, setGenericSaving] = useState(false);

  // ── Student + Parent modal ──
  const [studentOpen, setStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState(emptyStudentForm());
  const [studentErrs, setStudentErrs] = useState({});
  const [studentSaving, setStudentSaving] = useState(false);

  // ── Parent modal ──
  const [parentOpen, setParentOpen] = useState(false);
  const [parentForm, setParentForm] = useState(emptyParentForm());
  const [parentErrs, setParentErrs] = useState({});
  const [parentSaving, setParentSaving] = useState(false);

  // ── Fetch helpers ──

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userService.getUsers();
      setUsers(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await userService.getTeachers();
      setTeachers(data ?? []);
    } catch {
      setTeachers([]);
    }
  }, [isAdmin]);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await classService.getClasses();
      setClasses(data ?? []);
    } catch {
      setClasses([]);
    }
  }, []);

  // Students available to link when creating a Parent.
  // getUsers() already returns the role-filtered list from the API:
  // Admin → all users, Teacher → their own students.
  // We just filter client-side for role === "Student".
  const fetchStudents = useCallback(async () => {
    try {
      const data = await userService.getUsers();
      setStudents((data ?? []).filter(u => u.role === "Student"));
    } catch {
      setStudents([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTeachers();
    fetchClasses();
    fetchStudents();
  }, [fetchUsers, fetchTeachers, fetchClasses, fetchStudents]);

  // ── Filtered table rows ──

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    return (
      !q ||
      fullName.includes(q) ||
      u.userName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  // ── Modal open / close ──

  function openAddModal() {
    setGenericForm(emptyGenericForm());
    setGenericErrs({});
    setGenericOpen(true);
  }

  function closeGenericModal() {
    setGenericOpen(false);
    setGenericForm(emptyGenericForm());
    setGenericErrs({});
  }

  function openStudentModal() {
    setStudentForm(emptyStudentForm());
    setStudentErrs({});
    setStudentOpen(true);
  }

  function closeStudentModal() {
    setStudentOpen(false);
    setStudentForm(emptyStudentForm());
    setStudentErrs({});
  }

  function openParentModal() {
    setParentForm(emptyParentForm());
    setParentErrs({});
    setParentOpen(true);
  }

  function closeParentModal() {
    setParentOpen(false);
    setParentForm(emptyParentForm());
    setParentErrs({});
  }

  // Role change in generic modal — route Student and Parent to dedicated modals
  function handleGenericRoleChange(e) {
    const roleId = e.target.value;
    if (roleId === "3") {
      closeGenericModal();
      openStudentModal();
      return;
    }
    if (roleId === "4") {
      closeGenericModal();
      openParentModal();
      return;
    }
    setGenericForm(f => ({ ...f, roleId }));
  }

  // ── Form field helpers ──

  function gField(key) {
    return {
      value: genericForm[key],
      onChange: e => setGenericForm(f => ({ ...f, [key]: e.target.value })),
      error: genericErrs[key],
    };
  }

  function sField(key) {
    return {
      value: studentForm[key],
      onChange: e => setStudentForm(f => ({ ...f, [key]: e.target.value })),
      error: studentErrs[key],
    };
  }

  function pField(key) {
    return {
      value: parentForm[key],
      onChange: e => setParentForm(f => ({ ...f, [key]: e.target.value })),
      error: parentErrs[key],
    };
  }

  // ── Submit: generic user (Admin / Teacher roles only) ──

  async function handleCreateGeneric(e) {
    e?.preventDefault();
    const errs = validateGenericForm(genericForm);
    if (Object.keys(errs).length) { setGenericErrs(errs); return; }

    setGenericSaving(true);
    try {
      await userService.createUser({
        userName: genericForm.userName,
        firstName: genericForm.firstName,
        lastName: genericForm.lastName,
        email: genericForm.email,
        passwordHash: genericForm.passwordHash,
        roleId: Number(genericForm.roleId),
        phone: genericForm.phone || null,
      });
      toast("User created successfully", "success");
      closeGenericModal();
      await fetchUsers();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setGenericSaving(false);
    }
  }

  // ── Submit: Student + Parent ──

  async function handleCreateStudent(e) {
    e?.preventDefault();
    const errs = validateStudentForm(studentForm, isAdmin);
    if (Object.keys(errs).length) { setStudentErrs(errs); return; }

    setStudentSaving(true);
    try {
      await userService.createStudent({
        studentUserName: studentForm.studentUserName,
        studentFirstName: studentForm.studentFirstName,
        studentLastName: studentForm.studentLastName,
        studentEmail: studentForm.studentEmail,
        studentPassword: studentForm.studentPassword,
        studentPhone: studentForm.studentPhone,
        classId: Number(studentForm.classId),
        ...(isAdmin && { teacherId: Number(studentForm.teacherId) }),
        parentUserName: studentForm.parentUserName,
        parentFirstName: studentForm.parentFirstName,
        parentLastName: studentForm.parentLastName,
        parentEmail: studentForm.parentEmail,
        parentPassword: studentForm.parentPassword,
        parentPhone: studentForm.parentPhone,
      });
      toast("Student and parent accounts created", "success");
      closeStudentModal();
      await fetchUsers();
      await fetchStudents(); // refresh student list for parent picker
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setStudentSaving(false);
    }
  }

  // ── Submit: standalone Parent ──

  async function handleCreateParent(e) {
    e?.preventDefault();
    const errs = validateParentForm(parentForm);
    if (Object.keys(errs).length) { setParentErrs(errs); return; }

    setParentSaving(true);
    try {
      await userService.createUser({
        userName: parentForm.userName,
        firstName: parentForm.firstName,
        lastName: parentForm.lastName,
        email: parentForm.email,
        passwordHash: parentForm.passwordHash,
        roleId: 4,
        phone: parentForm.phone || null,
        studentId: Number(parentForm.studentId),
      });
      toast("Parent account created", "success");
      closeParentModal();
      await fetchUsers();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setParentSaving(false);
    }
  }

  // ── Select options ──

  // Generic modal only shows Admin/Teacher roles (Student→student modal, Parent→parent modal)
  const genericRoleOptions = isTeacher
    ? [] // Teachers go straight to student/parent modals via role change handler
    : ROLE_OPTIONS.filter(r => r.value === "1" || r.value === "2");

  const allowedRoles = isTeacher
    ? ROLE_OPTIONS.filter(r => TEACHER_ALLOWED_ROLES.includes(r.value))
    : ROLE_OPTIONS;

  const teacherOptions = teachers.map(t => ({
    value: String(t.userId),
    label: `${t.firstName} ${t.lastName}`,
  }));

  const classOptions = classes.map(c => ({
    value: String(c.id),
    label: c.className,
  }));

  const studentOptions = students.map(s => ({
    value: String(s.userId),
    label: `${s.firstName} ${s.lastName}`,
  }));

  // ── Table columns ──

  const columns = [
    {
      key: "avatar",
      label: "",
      width: 52,
      render: (_, row) => (
        <Avatar
          name={`${row.firstName} ${row.lastName}`}
          role={row.role}
          size="sm"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: "userName", label: "Username" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (val) => (
        <Badge variant={ROLE_BADGE_VARIANT[val] ?? "default"}>{val}</Badge>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (val) =>
        val || <span style={{ color: "var(--color-text-muted)" }}>—</span>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => (
        <Badge variant={val !== false ? "success" : "default"}>
          {val !== false ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="page-fade-in">
      <PageHeader
        title="Users"
        subtitle={`${filtered.length} user${filtered.length !== 1 ? "s" : ""} found`}
        actions={
          canCreate && (
            <Button
              onClick={openAddModal}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            >
              Add User
            </Button>
          )
        }
      />

      <div className="table-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or role…"
          className="toolbar-search"
        />
        <div className="toolbar-meta">
          {loading ? "Loading…" : `${filtered.length} of ${users.length} users`}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "1rem" }}>{error}</div>
      )}

      <div className="card">
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyText={search ? "No users match your search" : "No users yet. Add one to get started."}
        />
      </div>

      {/* ── Generic modal: Admin / Teacher roles ────────────────────────── */}
      <Modal
        isOpen={genericOpen}
        onClose={closeGenericModal}
        title="Add New User"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={closeGenericModal}>Cancel</Button>
            <Button
              loading={genericSaving}
              onClick={handleCreateGeneric}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Create User
            </Button>
          </div>
        }
      >
        <div className="form-row">
          <Input label="First Name" {...gField("firstName")} />
          <Input label="Last Name"  {...gField("lastName")} />
        </div>
        <div className="form-row">
          <Input label="Username"           {...gField("userName")} />
          <Input label="Email" type="email" {...gField("email")} />
        </div>
        <div className="form-row">
          <Input label="Password" type="password" {...gField("passwordHash")} />
          <Input label="Phone"                    {...gField("phone")} />
        </div>

        <Select
          label="Role"
          placeholder="Select role"
          options={allowedRoles}
          value={genericForm.roleId}
          onChange={handleGenericRoleChange}
          error={genericErrs.roleId}
        />

        <p className="form-hint" style={{ marginTop: "0.5rem" }}>
          {isTeacher
            ? `Selecting "Student" or "Parent" will open a dedicated form.`
            : `Selecting "Student" opens a guided form that creates both the student and parent together. Selecting "Parent" lets you link a parent to an existing student.`}
        </p>
      </Modal>

      {/* ── Student + Parent modal ───────────────────────────────────────── */}
      <Modal
        isOpen={studentOpen}
        onClose={closeStudentModal}
        title="Add Student & Parent"
        size="lg"
        footer={
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={closeStudentModal}>Cancel</Button>
            <Button
              loading={studentSaving}
              onClick={handleCreateStudent}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Create Student & Parent
            </Button>
          </div>
        }
      >
        <SectionLabel>Student Details</SectionLabel>

        <div className="form-row">
          <Input label="First Name" {...sField("studentFirstName")} />
          <Input label="Last Name"  {...sField("studentLastName")} />
        </div>
        <div className="form-row">
          <Input label="Username"           {...sField("studentUserName")} />
          <Input label="Email" type="email" {...sField("studentEmail")} />
        </div>
        <div className="form-row">
          <Input label="Password" type="password" {...sField("studentPassword")} />
          <Input label="Phone"                    {...sField("studentPhone")} />
        </div>
        <div className="form-row">
          <Select
            label="Class"
            placeholder={classOptions.length ? "Select class" : "Loading classes…"}
            options={classOptions}
            {...sField("classId")}
          />
          {isAdmin && (
            <Select
              label="Teacher"
              placeholder={teacherOptions.length ? "Select teacher" : "Loading teachers…"}
              options={teacherOptions}
              {...sField("teacherId")}
            />
          )}
        </div>

        <SectionLabel>Parent / Guardian Details</SectionLabel>

        <p className="form-hint" style={{ marginBottom: "0.75rem" }}>
          A parent account will be created and linked to this student automatically.
        </p>

        <div className="form-row">
          <Input label="First Name" {...sField("parentFirstName")} />
          <Input label="Last Name"  {...sField("parentLastName")} />
        </div>
        <div className="form-row">
          <Input label="Username"           {...sField("parentUserName")} />
          <Input label="Email" type="email" {...sField("parentEmail")} />
        </div>
        <div className="form-row">
          <Input label="Password" type="password" {...sField("parentPassword")} />
          <Input label="Phone"                    {...sField("parentPhone")} />
        </div>
      </Modal>

      {/* ── Parent modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={parentOpen}
        onClose={closeParentModal}
        title="Add Parent"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={closeParentModal}>Cancel</Button>
            <Button
              loading={parentSaving}
              onClick={handleCreateParent}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Create Parent
            </Button>
          </div>
        }
      >
        <div className="form-row">
          <Input label="First Name" {...pField("firstName")} />
          <Input label="Last Name"  {...pField("lastName")} />
        </div>
        <div className="form-row">
          <Input label="Username"           {...pField("userName")} />
          <Input label="Email" type="email" {...pField("email")} />
        </div>
        <div className="form-row">
          <Input label="Password" type="password" {...pField("passwordHash")} />
          <Input label="Phone"                    {...pField("phone")} />
        </div>

        <Select
          label="Linked Student"
          placeholder={studentOptions.length ? "Select student" : "No students found"}
          options={studentOptions}
          {...pField("studentId")}
        />

        {!studentOptions.length && (
          <p className="form-hint" style={{ marginTop: "0.5rem", color: "var(--color-warning)" }}>
            No students available to link. Create a student first.
          </p>
        )}
      </Modal>
    </div>
  );
}