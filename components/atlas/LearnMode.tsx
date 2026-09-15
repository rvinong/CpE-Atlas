import { useAtlas } from '@/lib/atlas/store';
import { lessons } from '@/lib/atlas/learning';
import { Button } from '@/components/ui/button';
export function LearnMode() {
  const state = useAtlas();
  const lesson = lessons.find((item) => item.id === state.lessonId);
  if (!lesson) return null;
  const step = lesson.steps[state.lessonStep];
  return (
    <section className="guided-lesson" aria-label="Guided lesson">
      <div className="lesson-heading">
        <span className="eyebrow">GUIDED LESSON</span>
        <Button variant="ghost" size="sm" onClick={state.exitLesson}>
          Exit lesson
        </Button>
      </div>
      <h3>{lesson.title}</h3>
      <div aria-live="polite" aria-atomic="true">
        <small>
          Step {state.lessonStep + 1} of {lesson.steps.length}
        </small>
        <h4>{step.title}</h4>
        <p>{step.description}</p>
      </div>
      <progress
        aria-label="Lesson progress"
        value={state.lessonStep + 1}
        max={lesson.steps.length}
      />
      <div className="lesson-actions">
        <Button
          variant="outline"
          disabled={!state.lessonStep}
          onClick={() => state.stepLesson(state.lessonStep - 1)}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            state.lessonStep === lesson.steps.length - 1
              ? state.exitLesson()
              : state.stepLesson(state.lessonStep + 1)
          }
        >
          {state.lessonStep === lesson.steps.length - 1
            ? 'Finish lesson'
            : 'Next'}
        </Button>
      </div>
      <Button variant="ghost" onClick={() => state.startLesson(lesson.id)}>
        Restart lesson
      </Button>
      <small>
        Selecting another part exits the lesson. You can restart at any time.
      </small>
    </section>
  );
}
