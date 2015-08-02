 <property name="left_attach">0</property>
                <property name="top_attach">0</property>
                <property name="width">1</property>
                <property name="height">1</property>
              </packing>
            </child>
            <child>
              <object class="swuilo-DDListBox" id="addresses:border">
                <property name="visible">True</property>
                <property name="can_focus">True</property>
                <child internal-child="selection">
                  <object class="GtkTreeSelection" id="treeview-selection1"/>
                </child>
              </object>
              <packing>
                <property name="left_attach">0</property>
                <property name="top_attach">1</property>
                <property name="width">1</property>
                <property name="height">5</property>
              </packing>
            </child>
            <child>
              <object class="GtkLabel" id="addressdestft">
                <property name="visible">True</property>
                <property name="can_focus">False</property>
                <property name="xalign">0</property>
                <property name="label" translatable="yes">1. Drag address elements here</property>
                <property name="use_underline">True</property>
                <property name="mnemonic_widget">addressdest:border</property>
              </object>
              <packing>
                <property name="left_attach">2</property>
                <property name="top_attach">0</property>
                <property name="width">1</property>
                <property name="height">1</property>
              </packing>
            </child>
            <child>
              <object class="GtkGrid" id="grid3">
                <property name="visible">True</property>
                <property name="can_focus">False</property>
                <property name="halign">center</property>
                <property name="valign">center</property>
                <property name="row_homogeneous">True</property>
                <property name="column_homogeneous">True</property>
                <child>
                  <object class="GtkButton" id="up">
                    <property name="visible">True</property>
                    <property name="can_focus">True</property>
                    <property name="receives_default">True</property>
                    <property name="tooltip_text" translatable="yes">Move up</property>
                    <property name="image">image3</property>
                  </object>
                  <packing>
                    <property name="left_attach">1</property>
                    <property name="top_attach">0</property>
                    <property name="width">1</property>
                    <property name="height">1</property>
                  </packing>
                </child>
                <child>
                  <object class="GtkButton" id="left">
                    <property name="visible">True</property>
                    <property name="can_focus">True</property>
                    <property name="receives_default">True</property>
                    <property name="tooltip_text" translatable="yes">Move left</property>
                    <property name="image">image2</property>
                  </object>
                  <packing>
                    <property name="left_attach">0</property>
                    <property name="top_attach">1</property>
                    <property name="width">1</property>
                    <property name="height">1</property>
                  </packing>
                </child>
                <child>
                  <object class="GtkButton" id="right">
                    <property name="visible">True</property>
                    <property name="can_focus">True</property>
                    <property name="receives_default">True</property>
                    <property name="tooltip_text" translatable="yes">Move right</property>
                    <property name="image">image1</property>
                  </object>
                  <packing>
                    <property name="left_attach">2</property>
                    <property name="top_attach">1</property>
                    <property name="width">1</property>
                    <property name="height">1</property>
                  </packing>
                </child>
                <child>
                  <object class="GtkButton" id="down">
                    <property name="visible">True</property>
                    <property name="can_focus">True</property>
                    <property name="receives_default">True</property>
                    <property name="tooltip_text" translatable="yes">Move down</property>
                    <property name="image">image4</property>
                  </object>
                  <packing>
                    <property name="left_attach">1</property>
                    <property name="top_attach">2</property>
                    <property name="width">1</property>
                    <property name="height">1</property