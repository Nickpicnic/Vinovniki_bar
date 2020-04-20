select 
    bf.*,
    bfl1.name as name_ru,
    bfl2.name as name_en,
    '/f'||ffile_path(f.file_folder_id)||f.id||'.'||f.ext as image_url
from 
    Tbar_flavors bf
    left join Tbar_flavors_l10n bfl1 on bf.id=bfl1.fid_id and bfl1.l10n_id=1
    left join Tbar_flavors_l10n bfl2 on bf.id=bfl2.fid_id and bfl2.l10n_id=3
    left join Tfiles f on bf.image_id=f.id;