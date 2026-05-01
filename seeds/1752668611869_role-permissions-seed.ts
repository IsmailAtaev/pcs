import type { Kysely } from 'kysely';

export async function seed(db: Kysely<any>): Promise<void> {
  // Fetch all existing permissions to get their IDs
  const allPerms = await db.selectFrom('permissions').selectAll().execute();
  const permMap = new Map<string, string>();
  allPerms.forEach((p) => permMap.set(`${p.module}:${p.action}`, p.id));

  const rolePermissions: { role: string; permissionId: string }[] = [];
  const add = (role: string, module: string, action: string) => {
    const id = permMap.get(`${module}:${action}`);
    if (id) rolePermissions.push({ role, permissionId: id });
  };

  // Analysis results from controllers:

  // STUDENT
  ['CARD', 'GRADE', 'LESSON', 'LESSON_ATTENDANCE', 'LOCATION', 'WEEK_DEF'].forEach(m => add('STUDENT', m, 'READ'));

  // TEACHER
  add('TEACHER', 'CARD', 'READ');
  add('TEACHER', 'GRADE', 'READ');
  add('TEACHER', 'GRADE', 'CREATE');
  add('TEACHER', 'LESSON', 'READ');
  add('TEACHER', 'LESSON', 'UPDATE');
  add('TEACHER', 'TOPIC', 'CREATE');
  add('TEACHER', 'TOPIC', 'UPDATE');
  add('TEACHER', 'LESSON_ATTENDANCE', 'READ');
  add('TEACHER', 'LESSON_ATTENDANCE', 'UPDATE');
  add('TEACHER', 'LOCATION', 'READ');
  add('TEACHER', 'STUDENT_MARK', 'READ');
  add('TEACHER', 'STUDENT_MARK', 'CREATE');
  add('TEACHER', 'TEACHER', 'READ');
  add('TEACHER', 'TEACHER', 'CREATE');
  add('TEACHER', 'TEACHER', 'UPDATE');
  add('TEACHER', 'TEACHER', 'DELETE');

  // ADMIN (all modules guarded with ['ADMIN'])
  const adminModules = [
    'ACADEMY', 'CARD', 'CLASSROOM', 'CLASS', 'DAY_DEF', 'GRADE', 'GROUP',
    'GROUP_STUDENT', 'INFO', 'INSTITUTION', 'JOURNAL', 'LESSON', 'LESSON_ATTENDANCE',
    'LOCATION', 'NEWS', 'PERIOD', 'PERMISSION', 'QUOTES', 'STUDENT_MARK',
    'SUBJECT', 'SUBJECT_SETTINGS', 'SUBJECT_SETTINGS_CLASSROOM', 'SUBJECT_SETTINGS_GROUP',
    'SUBJECT_SETTINGS_TEACHER', 'SUBJECT_SETTINGS_TYPE', 'TERM_DEF', 'TOPIC', 'USER',
    'STUDENT', 'WEEK_DEF', 'YEAR'
  ];
  adminModules.forEach(m => {
    ['READ', 'CREATE', 'UPDATE', 'DELETE'].forEach(a => add('ADMIN', m, a));
  });

  // SUPERADMIN (gets everything)
  allPerms.forEach(p => rolePermissions.push({ role: 'SUPERADMIN', permissionId: p.id }));

  await db.deleteFrom('role_permissions').execute();
  if (rolePermissions.length > 0) {
    await db.insertInto('role_permissions').values(rolePermissions).execute();
  }
}
