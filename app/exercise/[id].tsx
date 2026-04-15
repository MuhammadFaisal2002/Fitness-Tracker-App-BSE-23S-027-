import { useExercises } from "@/hooks/use-exercises";
import { getExerciseById, toggleCompleted } from "@/store/exercises";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORY_COLORS: Record<string, string> = {
  Chest: "#FF6B6B",
  Legs: "#4ECDC4",
  Core: "#45B7D1",
  Cardio: "#FFA07A",
  "Full Body": "#98D8C8",
  Custom: "#C3A6FF",
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Subscribe to store so completed state updates live
  useExercises();
  const exercise = getExerciseById(id);

  if (!exercise) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={60} color="#555" />
        <Text style={styles.notFoundText}>Exercise not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[exercise.category] ?? CATEGORY_COLORS.Custom;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: exercise.image }}
          style={styles.image}
          accessibilityLabel={`Image of ${exercise.name}`}
        />
        <View style={styles.imageOverlay} />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Title over image */}
        <View style={styles.imageTitleContainer}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryBadgeText}>{exercise.category}</Text>
          </View>
          <Text style={styles.imageTitle}>{exercise.name}</Text>
          {exercise.custom && (
            <View style={styles.customBadge}>
              <Ionicons name="create-outline" size={12} color="#C3A6FF" />
              <Text style={styles.customBadgeText}>Custom Exercise</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons
              name={exercise.completed ? "checkmark-circle" : "time-outline"}
              size={22}
              color={exercise.completed ? "#4ECDC4" : "#FFA07A"}
            />
            <Text
              style={[
                styles.statusText,
                { color: exercise.completed ? "#4ECDC4" : "#FFA07A" },
              ]}
            >
              {exercise.completed ? "Completed" : "Not completed yet"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>About this exercise</Text>
        <Text style={styles.description}>{exercise.description}</Text>

        {/* Tips */}
        <Text style={styles.sectionLabel}>Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color="#FFD700" style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>
            Warm up before starting. Focus on proper form over speed or weight.
            Rest 30–60 seconds between sets for best results.
          </Text>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            exercise.completed && styles.completeButtonDone,
          ]}
          onPress={() => toggleCompleted(exercise.id)}
          accessibilityLabel={
            exercise.completed
              ? `Mark ${exercise.name} as incomplete`
              : `Mark ${exercise.name} as complete`
          }
          accessibilityRole="button"
        >
          <Ionicons
            name={exercise.completed ? "close-circle-outline" : "checkmark-circle-outline"}
            size={22}
            color={exercise.completed ? "#1a1a2e" : "#1a1a2e"}
          />
          <Text style={styles.completeButtonText}>
            {exercise.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  imageContainer: {
    height: 280,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,26,46,0.45)",
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  imageTitleContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  categoryBadgeText: {
    color: "#1a1a2e",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  imageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  customBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  customBadgeText: {
    color: "#C3A6FF",
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 24,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },
  tipText: {
    flex: 1,
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
  },
  completeButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeButtonDone: {
    backgroundColor: "#FF6B6B",
  },
  completeButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
  notFound: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    color: "#888",
    fontSize: 18,
  },
  backBtn: {
    backgroundColor: "#4ECDC4",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 8,
  },
  backBtnText: {
    color: "#1a1a2e",
    fontWeight: "700",
    fontSize: 15,
  },
});
