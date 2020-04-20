select
    br.*,
    brl1.name as name_ru,
    brl2.name as name_en,
    '/f'||ffile_path(f.file_folder_id)||f.id||'.'||f.ext as image_url,
    br.description as description
from 
    Tbar_regions br
    left join Tbar_regions_l10n brl1 on br.id=brl1.fid_id and brl1.l10n_id=1
    left join Tbar_regions_l10n brl2 on br.id=brl2.fid_id and brl2.l10n_id=3
    left join Tfiles f on br.image_id=f.id
