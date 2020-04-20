select
	bc.*,
	bcl1.name as name_ru,
	bcl2.name as name_en,
	'/f'||ffile_path(f.file_folder_id)||f.id||'.'||f.ext as image_url
from
	Tbar_categories bc
    left join Tbar_categories_l10n bcl1 on bc.id=bcl1.fid_id and bcl1.l10n_id=1
    left join Tbar_categories_l10n bcl2 on bc.id=bcl2.fid_id and bcl1.l10n_id=3
    left join Tfiles f on bc.image_id=f.id
