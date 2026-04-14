import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { createNote, updateNote } from '@/services/notes.service'
import { useNotesStore } from '@/stores/notesStore'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { PRIORITY_LEVELS, NOTE_CATEGORIES } from '@/lib/constants'
import type { NoteStatus } from '@/types/note'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  content: z.string().max(200).optional().default(''),
  priority: z.enum(['urgent', 'high', 'medium', 'low', 'none']),
  category: z.enum(['study', 'research', 'idea', 'reference', 'task', 'other']),
  status: z.enum(['backlog', 'todo', 'in_progress', 'done']),
  tags: z.string().optional().default(''),
  dueDate: z.string().optional().default(''),
})

type FormValues = z.infer<typeof schema>

export function NoteModal() {
  const { modalOpen, editingNote, closeModal } = useUIStore()
  const user = useAuthStore((s) => s.user)
  const notes = useNotesStore((s) => s.notes)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', content: '', priority: 'none', category: 'task', status: 'todo', tags: '', dueDate: '',
    },
  })

  useEffect(() => {
    if (editingNote) {
      reset({
        title: editingNote.title,
        content: editingNote.content,
        priority: editingNote.priority,
        category: editingNote.category,
        status: editingNote.status,
        tags: editingNote.tags.join(', '),
        dueDate: editingNote.dueDate?.split('T')[0] ?? '',
      })
    } else {
      reset({ title: '', content: '', priority: 'none', category: 'task', status: 'todo', tags: '', dueDate: '' })
    }
  }, [editingNote, reset])

  async function onSubmit(values: FormValues) {
    if (!user) return

    const tags = values.tags
      ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const dueDate = values.dueDate ? new Date(values.dueDate).toISOString() : null
    const maxOrder = notes.length > 0 ? Math.max(...notes.map((n) => n.columnOrder)) + 1 : 0

    if (editingNote) {
      await updateNote(user.uid, editingNote.id, {
        title: values.title,
        content: values.content ?? '',
        priority: values.priority,
        category: values.category,
        status: values.status as NoteStatus,
        tags,
        dueDate,
        completedAt: values.status === 'done' ? (editingNote.completedAt ?? new Date().toISOString()) : null,
      })
    } else {
      await createNote(user.uid, {
        title: values.title,
        content: values.content ?? '',
        priority: values.priority,
        category: values.category,
        status: values.status as NoteStatus,
        tags,
        dueDate,
        completedAt: null,
        columnOrder: maxOrder,
      })
    }
    closeModal()
  }

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingNote ? 'Edit Note' : 'New Note'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title *</Label>
              <span className={`text-xs tabular-nums ${watch('title').length > 80 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {watch('title').length}/80
              </span>
            </div>
            <Input id="title" placeholder="What's on your mind?" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <span className={`text-xs tabular-nums ${(watch('content')?.length ?? 0) > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {watch('content')?.length ?? 0}/200
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="Details, links, ideas…"
              className="min-h-[100px]"
              {...register('content')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(v) => setValue('priority', v as FormValues['priority'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', v as FormValues['status'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => setValue('category', v as FormValues['category'])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {NOTE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="react, study, important" {...register('tags')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : editingNote ? 'Save Changes' : 'Create Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
