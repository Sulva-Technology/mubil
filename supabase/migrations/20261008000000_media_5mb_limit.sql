-- Raise the media bucket upload cap from 2 MB to 5 MB (matches MAX_BYTES in
-- src/lib/admin/image.ts).
update storage.buckets
set file_size_limit = 5242880
where id = 'media';
