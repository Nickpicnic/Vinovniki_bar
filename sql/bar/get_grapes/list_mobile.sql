select 
    bg.*,
    bgl1.name as name_ru,
    bgl2.name as name_en,
    '/f'||ffile_path(f.file_folder_id)||f.id||'.'||f.ext as image_url
from 
    Tbar_grapes bg
    left join Tbar_grapes_l10n bgl1 on bg.id=bgl1.fid_id and bgl1.l10n_id=1
    left join Tbar_grapes_l10n bgl2 on bg.id=bgl2.fid_id and bgl2.l10n_id=3
    left join Tfiles f on bg.image_id=f.id;