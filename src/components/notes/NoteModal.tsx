import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
import type { NoteStatus } from '@/types/note'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  content: z.string().max(200).optional().default(''),
  priority: z.enum(['urgent', 'high', 'medium', 'low', 'none']),
  category: z.enum(['study', 'research', 'idea', 'reference', 'task', 'other']),
  status: z.enum(['backlog', 'todo', 'in_progress', 'done']),
  tags: z.string().max(50).optional().default(''),
  dueDate: z.string().optional().default(''),
})

type FormValues = z.infer<typeof schema>

export function NoteModal() {
  const { t } = useTranslation()
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
          <DialogTitle>{editingNote ? t('modal.editNote') : t('modal.newNote')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">{t('modal.titleLabel')}</Label>
              <span className={`text-xs tabular-nums ${watch('title').length > 80 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {watch('title').length}/80
              </span>
            </div>
            <Input id="title" placeholder={t('modal.titlePlaceholder')} maxLength={80} {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">{t('modal.contentLabel')}</Label>
              <span className={`text-xs tabular-nums ${(watch('content')?.length ?? 0) > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {watch('content')?.length ?? 0}/200
              </span>
            </div>
            <Textarea
              id="content"
              placeholder={t('modal.contentPlaceholder')}
              className="min-h-[100px]"
              maxLength={200}
              {...register('content')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('modal.priorityLabel')}</Label>
              <Select
                value={watch('priority')}
                onValueChange={(v) => setValue('priority', v as FormValues['priority'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['urgent', 'high', 'medium', 'low', 'none'] as const).map((v) => (
                    <SelectItem key={v} value={v}>{t(`priority.${v}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('modal.statusLabel')}</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', v as FormValues['status'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['backlog', 'todo', 'in_progress', 'done'] as const).map((v) => (
                    <SelectItem key={v} value={v}>{t(`columns.${v}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('modal.categoryLabel')}</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => setValue('category', v as FormValues['category'])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['study', 'research', 'idea', 'reference', 'task', 'other'] as const).map((v) => (
                  <SelectItem key={v} value={v}>{t(`category.${v}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">{t('modal.tagsLabel')}</Label>
            <Input id="tags" placeholder={t('modal.tagsPlaceholder')} {...register('tags')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">{t('modal.dueDateLabel')}</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : editingNote ? t('common.saveChanges') : t('common.createNote')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
