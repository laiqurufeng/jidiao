package com.phonegap.sample;

import java.lang.reflect.Field;

public final class ReflectUtils {
	public static Object a(Field paramField, Object paramObject) {
		Object localObject = null;

		if (paramField == null) {
			return null;
		}

		if (paramField != null) {
			paramField.setAccessible(true);
			try {
				localObject = paramField.get(paramObject);
			} catch (ThreadDeath localThreadDeath) {
				throw localThreadDeath;
			} catch (Throwable localThrowable) {
				// throw new cd("Unable to get value of field", localThrowable);
			}
		}

		return localObject;
	}

	public static Field setAccessible(Class<?> clazz, Class<?> type, boolean paramBoolean) {
		Field[] arrayOfField = clazz.getDeclaredFields();
		Field localField = null;

		for (int i = 0; i < arrayOfField.length; i++) {
			if (type.isAssignableFrom(arrayOfField[i].getType())) {
				if (localField != null) {
					// throw new cd("Field is ambiguous: " +
					// localField.getName() + ", " + arrayOfField[i].getName());
				}

				localField = arrayOfField[i];
			}
		}

		if (localField == null) {
			if (paramBoolean) {
				// throw new cd("Could not find field matching type: " +
				// paramClass2.getName());
			}
		} else {
			localField.setAccessible(true);
		}

		return localField;
	}
}