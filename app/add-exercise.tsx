import { addExercise } from "@/store/exercises";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES = ["Chest", "Legs", "Core", "Cardio", "Full Body", "Custom"];

const CATEGORY_COLORS: Record<string, string> = {
  Chest: "#FF6B6B",
  Legs: "#4ECDC4",
  Core: "#45B7D1",
  Cardio: "#FFA07A",
  "Full Body": "#98D8C8",
  Custom: "#C3A6FF",
};

// Default placeholder images per category
const CATEGORY_IMAGES: Record<string, string> = {
  Chest: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  Legs: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80",
  Core: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&q=80",
  Cardio: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  "Full Body": "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80",
  Custom: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
};

export default function AddExerciseScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  function validate(): boolean {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) newErrors.name = "Exercise name is required.";
    else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";
    if (!description.trim()) newErrors.description = "Description is required.";
    else if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    addExercise({
      name: name.trim(),
      description: description.trim(),
      category,
      image: imageUrl.trim() || CATEGORY_IMAGES[category],
    });

    Alert.alert("Exercise Added!", `"${name.trim()}" has been added to your list.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Exercise</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {/* Name */}
          <Text style={styles.label}>
            Exercise Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="e.g. Mountain Climbers"
            placeholderTextColor="#555"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            maxLength={50}
            accessibilityLabel="Exercise name input"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && {
                    backgroundColor: CATEGORY_COLORS[cat],
                    borderColor: CATEGORY_COLORS[cat],
                  },
                ]}
                onPress={() => setCategory(cat)}
                accessibilityLabel={`Select category ${cat}`}
                accessibilityRole="radio"
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
            placeholder="Describe how to perform this exercise..."
            placeholderTextColor="#555"
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
            accessibilityLabel="Exercise description input"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
          <Text style={styles.charCount}>{description.length}/500</Text>

          {/* Image URL (optional) */}
          <Text style={styles.label}>
            Image URL{" "}
            <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#555"
            value={imageUrl}
            onChangeText={setImageUrl}
            keyboardType="url"
            autoCapitalize="none"
            accessibilityLabel="Exercise image URL input"
          />
          <Text style={styles.hint}>
            Leave blank to use a default image for the selected category.
          </Text>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            accessibilityLabel="Save exercise"
            accessibilityRole="button"
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#1a1a2e" />
            <Text style={styles.submitButtonText}>Save Exercise</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 20,
  },
  required: {
    color: "#FF6B6B",
  },
  optional: {
    color: "#666",
    textTransform: "none",
    fontWeight: "400",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#2d2d44",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    color: "#555",
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  hint: {
    color: "#555",
    fontSize: 12,
    marginTop: 6,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#2d2d44",
    backgroundColor: "#16213e",
  },
  categoryChipText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#1a1a2e",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
  },
  submitButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
});
